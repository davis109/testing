import sys
import re

# Lines with indentation issues
problem_lines = [153, 356, 512, 524, 989, 1072]

# Read the file
with open('ai/app.py', 'r') as f:
    lines = f.readlines()

# Fix indentation issues
fixed_lines = []
for i, line in enumerate(lines, start=1):
    if i in problem_lines:
        # Add proper indentation to these specific lines
        fixed_lines.append(' ' * 8 + line.strip() + '\n')
    else:
        fixed_lines.append(line)

# Write the fixed file
with open('ai/app.py.fixed', 'w') as f:
    f.writelines(fixed_lines)

# Read the file
with open('ai/app.py.fixed', 'r') as f:
    content = f.read()

# Fix issues with try blocks without except
content = re.sub(r'try:\s+([^{])', r'try:\n        \1\n    except Exception as e:\n        print(f"Error: {str(e)}")\n        raise', content)

# Fix wrong indentation after if blocks
content = re.sub(r'if (.+?):\s+(.+?)\s+else:', r'if \1:\n        \2\n    else:', content)

# Fix indentation in functions
content = re.sub(r'def (.+?):\s+(.+?)\s+return', r'def \1:\n    \2\n    return', content)

# Write the fixed file
with open('ai/app.py.fixed2', 'w') as f:
    f.write(content)

print('Fixed indentation, fixed try blocks, fixed if blocks') 