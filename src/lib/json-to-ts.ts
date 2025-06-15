
import type { OutputFormat } from "@/app/page";

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

function getBaseTypeName(key: string): string {
  let name = key.replace(/[^a-zA-Z0-9_]/g, ''); 
  if (!name) name = 'Unnamed'; 

  if (name.includes('_')) {
    name = name.split('_').map(part => capitalize(part.toLowerCase())).join('');
  } else {
    name = capitalize(name); 
  }
  
  if (name.endsWith('ies') && name.length > 3) {
    name = name.substring(0, name.length - 3) + 'y';
  } else if (name.endsWith('s') && !name.endsWith('ss') && name.length > 1) {
    name = name.substring(0, name.length - 1);
  }
  return name;
}


export function convertJsonToTs(
  jsonString: string, 
  rootName: string = "RootObject",
  outputFormat: OutputFormat = "interface" 
): ConversionResult {
  try {
    const data = JSON.parse(jsonString);
    let accumulatedDefinitions: string = "";
    const definedNames: Set<string> = new Set(); 

    function generateUniquePrefixedName(prefixedName: string): string {
      let finalName = prefixedName;
      let count = 1;
      while (definedNames.has(finalName)) {
        finalName = `${prefixedName}${count++}`;
      }
      return finalName;
    }

    function generateTsDefinition(value: any, baseNameForType: string, currentOutputFormat: OutputFormat): string {
      if (value === null) return "null";
      if (typeof value === "string") return "string";
      if (typeof value === "number") return "number";
      if (typeof value === "boolean") return "boolean";

      if (Array.isArray(value)) {
        if (value.length === 0) return "any[]";
        const itemBaseName = getBaseTypeName(baseNameForType); 
        const itemTypeName = generateTsDefinition(value[0], itemBaseName, currentOutputFormat);
        return `${itemTypeName}[]`;
      }

      if (typeof value === "object") {
        const prefix = currentOutputFormat === 'interface' ? 'I' : 'T';
        const prefixedName = prefix + baseNameForType;
        const finalName = generateUniquePrefixedName(prefixedName);
        
        if (!definedNames.has(finalName)) {
          definedNames.add(finalName); 

          let definitionStart = currentOutputFormat === 'interface' 
            ? `interface ${finalName} {\n` 
            : `type ${finalName} = {\n`;
          
          let properties = "";
          for (const key in value) {
            if (Object.prototype.hasOwnProperty.call(value, key)) {
              const propertyBaseName = getBaseTypeName(key); 
              properties += `  ${sanitizeKey(key)}: ${generateTsDefinition(value[key], propertyBaseName, currentOutputFormat)};\n`;
            }
          }
          const definition = definitionStart + properties + `}\n\n`;
          accumulatedDefinitions = definition + accumulatedDefinitions; 
        }
        return finalName;
      }
      return "any";
    }

    const baseRootName = getBaseTypeName(rootName); 
    const finalRootTypeNameString = generateTsDefinition(data, baseRootName, outputFormat);

    if ((Array.isArray(data) || (typeof data !== 'object' && data !== null))) {
         const prefixedTypeAliasName = "T" + baseRootName;
         const finalTypeAliasName = generateUniquePrefixedName(prefixedTypeAliasName);
         definedNames.add(finalTypeAliasName);
         accumulatedDefinitions = `type ${finalTypeAliasName} = ${finalRootTypeNameString};\n\n` + accumulatedDefinitions;
    }

    return { typescriptCode: accumulatedDefinitions.trim(), error: undefined };

  } catch (e: any) {
    if (e instanceof SyntaxError) {
      return { typescriptCode: "", error: `Invalid JSON: ${e.message}` };
    }
    return { typescriptCode: "", error: `An unexpected error occurred: ${e.message}` };
  }
}
