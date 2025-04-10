# Fix indentation in app.py
import os
import re
import sys

# Read the original file
with open('ai/app.py', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# List of lines with known indentation issues and their correct indentation level
problem_lines = {
    153: 12,  # indent by 12 spaces - out.write(frame)
    356: 16,  # indent by 16 spaces - video_data_url
    512: 4,   # indent by 4 spaces - image_data_url
    524: 4,   # indent by 4 spaces - input_path
    989: 12,  # indent by 12 spaces - out.write(frame)
    1072: 16, # indent by 16 spaces - video_data_url
    932: 16,  # indent by 16 spaces - cap = cv2
    964: 12,  # indent by 12 spaces - except block
    1006: 12, # indent by 12 spaces - frames, fps
    1064: 12  # indent by 12 spaces - create_video
}

# Fix indentation for specific lines
fixed_lines = []
for i, line in enumerate(lines, start=1):
    if i in problem_lines:
        stripped = line.lstrip()
        fixed_lines.append(' ' * problem_lines[i] + stripped)
    else:
        fixed_lines.append(line)

# Write the fixed content to a new file
with open('ai/app.py.fixed', 'w', encoding='utf-8') as f:
    f.writelines(fixed_lines)

print("Indentation fixes applied. New file created: ai/app.py.fixed")
print("To use the fixed file, run: copy ai\\app.py.fixed ai\\app.py")
