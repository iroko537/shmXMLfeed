import xml.etree.ElementTree as ET

def count_chars_in_descriptions(file_path):
    tree = ET.parse(file_path)
    root = tree.getroot()
    
    char_count_short_descriptions = 0
    char_count_long_descriptions = 0
    total_char_count = 0
    property_count = 0
    
    for property_element in root.findall(".//property"):
        property_count += 1
        descriptions_element = property_element.find("descriptions")
        
        if descriptions_element is not None:
            for short_description in descriptions_element.findall("short_description"):
                if 'lang' in short_description.attrib and short_description.attrib['lang'] == 'en':
                    char_count_short_descriptions += len(short_description.text) if short_description.text else 0
            for long_description in descriptions_element.findall("long_description"):
                if 'lang' in long_description.attrib and long_description.attrib['lang'] == 'en':
                    char_count_long_descriptions += len(long_description.text) if long_description.text else 0
    
    total_char_count = char_count_short_descriptions + char_count_long_descriptions

    return property_count, char_count_short_descriptions, char_count_long_descriptions, total_char_count

# Usage
file_path = '8d1dc2d9517d014d8e8f8b30e3683422.xml'
properties, short_desc_chars, long_desc_chars, total_chars = count_chars_in_descriptions(file_path)
print(f"Total properties: {properties}")
print(f"Total characters in EN short descriptions: {short_desc_chars}")
print(f"Total characters in EN long descriptions: {long_desc_chars}")
print(f"Total characters in EN descriptions: {total_chars}")


