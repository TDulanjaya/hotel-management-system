import os

def replace_in_file(filepath, replacements):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        new_content = content
        for old_str, new_str in replacements:
            new_content = new_content.replace(old_str, new_str)
            
        if new_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated {filepath}")
    except Exception as e:
        print(f"Error processing {filepath}: {e}")

replacements = [
    ("com.luxestay.backend", "com.luxestay.server"),
    ("BackendApplication", "ServerApplication"),
    ("backend/.env.local", "server/.env.local")
]

for root, dirs, files in os.walk("server/src"):
    for file in files:
        if file.endswith(".java") or file.endswith(".properties") or file.endswith(".xml"):
            filepath = os.path.join(root, file)
            replace_in_file(filepath, replacements)
            
print("Done processing server/src")
