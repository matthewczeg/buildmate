import os
from pathlib import Path

output_file = "all_files.txt"
root_dir = Path(".")
code_extensions = {".js", ".ts", ".tsx", ".py", ".css", ".html", ".md", ".txt"}
exclude_dirs = {"node_modules", ".next", ".git", ".vercel", ".cache", ".upm", ".swc", ".config"}
exclude_files = {"all_files.txt", "generate_code_tree.py"}

def should_exclude(path):
    for exclude_dir in exclude_dirs:
        if exclude_dir in path.parts:
            return True
    return False

def print_file_tree(path, prefix="", is_last=True, output=None, is_root=False):
    if path.is_dir() and should_exclude(path):
        return

    new_prefix = prefix + ("└── " if is_last else "├── ")

    if is_root:
        output.write("```\n")
        output.write(f"{path}\n")
    else:
        output.write(new_prefix + str(path.name) + "\n")

    if path.is_dir():
        children = list(path.iterdir())
        for index, child in enumerate(children):
            print_file_tree(child, prefix + ("    " if is_last else "│   "), index == len(children) - 1, output)

with open(output_file, "w", encoding="utf-8") as f:
    print_file_tree(root_dir, output=f, is_root=True)
    f.write("```\n")

    for path in root_dir.glob('**/*'):
        if path.is_file() and path.suffix in code_extensions and not should_exclude(path) and path.name not in exclude_files:
            f.write(f"\n\n{path} - code\n---\n")
            with open(path, "r", encoding="utf-8", errors="ignore") as file:
                code = file.read()
            f.write(''.join(line.strip() for line in code.splitlines()))
            f.write("\n\n---")
