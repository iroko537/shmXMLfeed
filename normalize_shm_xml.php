<?php

function normalize_xml($input_file_path, $output_file_path, $languages_order = ['en', 'es', 'de', 'nl', 'pl']) {
    $xml = simplexml_load_file($input_file_path);
    
    foreach ($xml->property as $property) {
        $descriptions = $property->descriptions;
        
        // Extract and store existing descriptions
        $existing_descriptions = [
            'short_description' => [],
            'long_description' => []
        ];
        
        foreach ($existing_descriptions as $desc_type => $_) {
            foreach ($descriptions->$desc_type as $desc) {
                $lang = (string) $desc['lang'];
                $existing_descriptions[$desc_type][$lang] = (string) $desc;
            }
            // Remove existing description elements
            unset($property->descriptions->$desc_type);
        }
        
        // Add descriptions in the specified language order
        foreach ($languages_order as $lang) {
            foreach ($existing_descriptions as $desc_type => $desc_texts) {
                $desc_element = $descriptions->addChild($desc_type, $desc_texts[$lang] ?? '');
                $desc_element->addAttribute('lang', $lang);
            }
        }
    }
    
    // Save the normalized XML to the output file
    $xml->asXML($output_file_path);
}

// Example usage:
// Please adjust the file paths according to your use case.
// normalize_xml('path_to_your_input_file.xml', 'path_to_your_output_file.xml');
?>
