const fs = require('fs');
const { parseString, Builder } = require('xml2js');

function normalizeXml(inputFilePath, outputFilePath, languagesOrder = ['en', 'es', 'de', 'nl', 'pl']) {
    const xml = fs.readFileSync(inputFilePath, 'utf-8');
    
    parseString(xml, { explicitArray: false }, (err, result) => {
        if (err) {
            console.error('Error parsing XML:', err);
            return;
        }

        const properties = result.properties.property;

        properties.forEach((property) => {
            const descriptions = property.descriptions;
            const existingDescriptions = {
                short_description: {},
                long_description: {}
            };

            ['short_description', 'long_description'].forEach((descType) => {
                const descElements = descriptions[descType];
                descElements.forEach((descElement) => {
                    const lang = descElement['$'].lang;
                    existingDescriptions[descType][lang] = descElement['_'];
                });

                // Clear existing description elements
                descriptions[descType] = [];
            });

            languagesOrder.forEach((lang) => {
                ['short_description', 'long_description'].forEach((descType) => {
                    const descText = existingDescriptions[descType][lang] || '';
                    descriptions[descType].push({
                        $: { lang: lang },
                        _: descText
                    });
                });
            });
        });

        const builder = new Builder();
        const normalizedXml = builder.buildObject(result);

        fs.writeFileSync(outputFilePath, normalizedXml);
    });
}

// Example usage:
// Please ensure to install the 'xml2js' module using npm and adjust the file paths according to your use case.
// normalizeXml('path_to_your_input_file.xml', 'path_to_your_output_file.xml');
