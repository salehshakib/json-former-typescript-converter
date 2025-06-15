export interface ConversionResult {
  typescriptCode: string;
  error?: string;
}

function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function sanitizeKey(key: string): string {
  if (key.match(/^[a-zA-Z_$][0-9a-zA-Z_$]*$/)) {
    return key;
  }
  return `"${key}"`;
}

// Generates a base, PascalCased, and somewhat singularized name from a key.
// e.g., "users" -> "User", "address_data" -> "AddressData", "item" -> "Item"
function getBaseTypeName(key: string): string {
  let name = key.replace(/[^a-zA-Z0-9_]/g, ''); 
  if (!name) name = 'Unnamed'; 

  // Convert to PascalCase from snake_case or camelCase
  if (name.includes('_')) {
    // Handle snake_case: convert to PascalCase (e.g., user_profile -> UserProfile)
    name = name.split('_').map(part => capitalize(part.toLowerCase())).join('');
  } else {
    // Ensures camelCase becomes PascalCase (e.g., userProfile -> UserProfile)
    // and single words or already PascalCase are correctly capitalized.
    name = capitalize(name); 
  }
  
  // Basic pluralization to singular (from original logic)
  if (name.endsWith('ies') && name.length > 3) { // e.g., categories -> category
    name = name.substring(0, name.length - 3) + 'y';
  } else if (name.endsWith('s') && !name.endsWith('ss') && name.length > 1) { // e.g., users -> user
    // This simple heuristic might incorrectly singularize some words (e.g., "status" to "statu").
    // A more robust pluralization library would be needed for perfect accuracy.
    name = name.substring(0, name.length - 1);
  }
  return name;
}


export function convertJsonToTs(jsonString: string, rootName: string = "RootObject"): ConversionResult {
  try {
    const data = JSON.parse(jsonString);
    let accumulatedInterfaces: string = "";
    // Tracks names of interfaces (IXyz) and types (TXyz) already defined to ensure uniqueness
    const definedNames: Set<string> = new Set(); 

    // Generates a unique name (e.g., IXyz, IXyz1 or TXyz, TXyz1) by appending a number if needed.
    function generateUniquePrefixedName(prefixedName: string): string {
      let finalName = prefixedName;
      let count = 1;
      while (definedNames.has(finalName)) {
        finalName = `${prefixedName}${count++}`;
      }
      return finalName;
    }

    function generateTsDefinition(value: any, baseNameForType: string): string {
      // baseNameForType is the non-prefixed, PascalCased, singularized name.
      // e.g., "User", "Address", "RootObject", "Item"
      if (value === null) return "null";
      if (typeof value === "string") return "string";
      if (typeof value === "number") return "number";
      if (typeof value === "boolean") return "boolean";

      if (Array.isArray(value)) {
        if (value.length === 0) return "any[]";
        // For array items, get a singular base name (e.g., "Users" -> "User")
        const itemBaseName = getBaseTypeName(baseNameForType); 
        const itemTypeName = generateTsDefinition(value[0], itemBaseName);
        return `${itemTypeName}[]`; // e.g., "IUser[]"
      }

      if (typeof value === "object") {
        const prefixedInterfaceName = "I" + baseNameForType; // e.g. "IRootObject", "IUser"
        const interfaceName = generateUniquePrefixedName(prefixedInterfaceName);
        
        if (!definedNames.has(interfaceName)) {
          definedNames.add(interfaceName); 

          let objectInterface = `interface ${interfaceName} {\n`;
          for (const key in value) {
            if (Object.prototype.hasOwnProperty.call(value, key)) {
              // For properties, generate a base name from the key
              const propertyBaseName = getBaseTypeName(key); 
              objectInterface += `  ${sanitizeKey(key)}: ${generateTsDefinition(value[key], propertyBaseName)};\n`;
            }
          }
          objectInterface += `}\n\n`;
          // Prepend to ensure nested types are defined before they are used
          accumulatedInterfaces = objectInterface + accumulatedInterfaces; 
        }
        return interfaceName; // Returns the prefixed name, e.g., "IRootObject", "IUser"
      }
      return "any"; // Fallback for any other types
    }

    // Get a clean base name for the root type (e.g., "RootObject")
    const baseRootName = getBaseTypeName(rootName); 
    const finalRootTypeNameString = generateTsDefinition(data, baseRootName);

    // If the root JSON is an array or a primitive type, create a type alias (e.g., TRootObject)
    if ((Array.isArray(data) || (typeof data !== 'object' && data !== null))) {
         const prefixedTypeAliasName = "T" + baseRootName; // e.g. "TRootObject"
         const finalTypeAliasName = generateUniquePrefixedName(prefixedTypeAliasName);
         definedNames.add(finalTypeAliasName); // Register the type alias name
         // Prepend the type alias definition
         accumulatedInterfaces = `type ${finalTypeAliasName} = ${finalRootTypeNameString};\n\n` + accumulatedInterfaces;
    }
    // If the root is an object, its interface (e.g., IRootObject) is already generated and in accumulatedInterfaces.

    return { typescriptCode: accumulatedInterfaces.trim(), error: undefined };

  } catch (e: any) {
    if (e instanceof SyntaxError) {
      return { typescriptCode: "", error: `Invalid JSON: ${e.message}` };
    }
    return { typescriptCode: "", error: `An unexpected error occurred: ${e.message}` };
  }
}

    