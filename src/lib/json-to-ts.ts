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

// Generates a plausible interface name from a key.
// Tries to make singular for array items, e.g., "users" -> "User".
function keyToInterfaceName(key: string): string {
  let name = key.replace(/[^a-zA-Z0-9_]/g, ''); // Remove special characters
  if (!name) name = 'Unnamed'; // Handle empty or fully special char keys

  name = capitalize(name);
  // Basic pluralization to singular for array item type names (very naive)
  if (name.endsWith('ies')) {
    name = name.substring(0, name.length - 3) + 'y';
  } else if (name.endsWith('s') && !name.endsWith('ss')) {
    name = name.substring(0, name.length - 1);
  }
  return name;
}


export function convertJsonToTs(jsonString: string, rootName: string = "RootObject"): ConversionResult {
  try {
    const data = JSON.parse(jsonString);
    let accumulatedInterfaces: string = "";
    const definedInterfaceNames: Set<string> = new Set(); // Tracks names of interfaces already defined

    function generateUniqueInterfaceName(baseName: string): string {
      let interfaceName = baseName;
      let count = 1;
      // Ensure unique name if baseName is already taken by a different structure
      // This simple uniqueness just appends a number. A more robust system
      // would compare structures if names collide.
      while (definedInterfaceNames.has(interfaceName)) {
        interfaceName = `${baseName}${count++}`;
      }
      return interfaceName;
    }

    function generateTsDefinition(value: any, suggestedName: string): string {
      if (value === null) return "null";
      if (typeof value === "string") return "string";
      if (typeof value === "number") return "number";
      if (typeof value === "boolean") return "boolean";

      if (Array.isArray(value)) {
        if (value.length === 0) return "any[]";
        // Assuming homogeneous array, infer type from first element
        const itemTypeName = generateTsDefinition(value[0], keyToInterfaceName(suggestedName + "Item"));
        return `${itemTypeName}[]`;
      }

      if (typeof value === "object") {
        const interfaceName = generateUniqueInterfaceName(capitalize(sanitizeKey(suggestedName).replace(/"/g, '')));
        
        // Check if an interface with this name has already been fully defined.
        // This check is simplistic; ideally, it would compare the structure.
        if (!definedInterfaceNames.has(interfaceName)) {
          definedInterfaceNames.add(interfaceName); // Mark as defined (or about to be)

          let objectInterface = `interface ${interfaceName} {\n`;
          for (const key in value) {
            if (Object.prototype.hasOwnProperty.call(value, key)) {
              objectInterface += `  ${sanitizeKey(key)}: ${generateTsDefinition(value[key], keyToInterfaceName(key))};\n`;
            }
          }
          objectInterface += `}\n\n`;
          accumulatedInterfaces = objectInterface + accumulatedInterfaces; // Prepend to define nested types first
        }
        return interfaceName;
      }
      return "any";
    }

    const finalRootTypeName = generateTsDefinition(data, rootName);

    // If the root is an array or primitive, create a type alias for RootObject
    if ( (Array.isArray(data) || (typeof data !== 'object' && data !== null)) && finalRootTypeName !== rootName ) {
         accumulatedInterfaces = `type ${rootName} = ${finalRootTypeName};\n\n` + accumulatedInterfaces;
    } else if (typeof data === "object" && !Array.isArray(data) && finalRootTypeName !== rootName) {
        // This case can happen if the root object itself was simple enough that its type string was returned directly,
        // or if generateUniqueInterfaceName changed `rootName`.
        // We should ensure the `rootName` is used for the top-level type definition if it's an object.
        // The current logic of `generateTsDefinition` for objects should return the interface name.
        // If `finalRootTypeName` is the actual name of the generated interface for the root object, this is fine.
        // If not, it means the root object's interface wasn't named `rootName`.
        // The current structure has `generateTsDefinition` always try to make an interface for an object
        // and add it to `accumulatedInterfaces`. The `finalRootTypeName` should be its name.
    }


    return { typescriptCode: accumulatedInterfaces.trim(), error: undefined };

  } catch (e: any) {
    if (e instanceof SyntaxError) {
      return { typescriptCode: "", error: `Invalid JSON: ${e.message}` };
    }
    return { typescriptCode: "", error: `An unexpected error occurred: ${e.message}` };
  }
}
