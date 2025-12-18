#!/bin/bash
# Script to fix all import paths in mingpan
# Converts @/ aliases to relative paths and removes React dependencies

MINGPAN_SRC="/home/dodd/dev/mingpan/src"

echo "=== Fixing import paths in mingpan ==="

# Function to calculate relative path
calculate_relative_path() {
    local from_dir="$1"
    local to_path="$2"
    python3 -c "import os.path; print(os.path.relpath('$to_path', '$from_dir'))"
}

# Fix all TypeScript files
find "$MINGPAN_SRC" -type f -name "*.ts" | while read file; do
    dir=$(dirname "$file")
    relpath_to_src=$(python3 -c "import os.path; print(os.path.relpath('$MINGPAN_SRC', '$dir'))")

    # Replace @/core/ with relative path to core
    sed -i "s|from '@/core/|from '${relpath_to_src}/core/|g" "$file"

    # Replace @/services/ with relative path to services
    sed -i "s|from '@/services/|from '${relpath_to_src}/services/|g" "$file"

    # Replace @/shared/ with relative path to shared
    sed -i "s|from '@/shared/|from '${relpath_to_src}/shared/|g" "$file"

    # Replace @/utils/ with relative path to utils
    sed -i "s|from '@/utils/|from '${relpath_to_src}/utils/|g" "$file"

    # Replace @/hooks/useT with empty (will be handled by removing the import)
    sed -i "s|import { useT } from '@/hooks/useT';||g" "$file"

    # Add .js extension for ESM imports (only for local imports starting with ./)
    # This is needed for NodeNext module resolution
done

echo "=== Import paths fixed ==="

# Show sample of fixed files
echo ""
echo "Sample of fixed imports:"
grep -r "from '\.\." "$MINGPAN_SRC" | head -5
