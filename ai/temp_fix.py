# Fix the critical indentation error at line 153
with open('app.py', 'r') as f:
    content = f.read()

# Search for the pattern of the error
error_pattern = "if frame is not None:  # Skip frames that failed to load\n        out.write(frame)"
fixed_pattern = "if frame is not None:  # Skip frames that failed to load\n            out.write(frame)"

# Replace the error pattern with the fixed pattern
fixed_content = content.replace(error_pattern, fixed_pattern)

# Save to a new file
with open('app.py.simple_fix', 'w') as f:
    f.write(fixed_content)

print("Created a simple fix focusing just on line 153")
print("To apply: copy app.py.simple_fix app.py") 