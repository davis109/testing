# Fixing indentation in app.py
import os
import re

# Read the original file
with open('ai/app.py', 'r') as f:
    lines = f.readlines()

# List of lines with known indentation issues
problem_lines = {
    153: 12,  # indent by 12 spaces
    356: 16,  # indent by 16 spaces
    512: 4,   # indent by 4 spaces
    524: 4,   # indent by 4 spaces
    989: 12,  # indent by 12 spaces
    1072: 16, # indent by 16 spaces
    932: 16,  # indent by 16 spaces
    964: 12,  # indent by 12 spaces
    1006: 12, # indent by 12 spaces
    1064: 12  # indent by 12 spaces
}

# Function to fix a specific line's indentation
def fix_indent(line_num, line, indent_spaces):
    stripped = line.lstrip()
    return ' ' * indent_spaces + stripped

# Apply fixes
fixed_lines = []
for i, line in enumerate(lines, start=1):
    if i in problem_lines:
        fixed_lines.append(fix_indent(i, line, problem_lines[i]))
    else:
        fixed_lines.append(line)

# Write the fixed content to a new file
with open('ai/app.py.fixed', 'w') as f:
    f.writelines(fixed_lines)

print("Indentation fixes applied. New file created: ai/app.py.fixed")
print("To use the fixed file, run: copy ai\\app.py.fixed ai\\app.py")
