#!/bin/bash

# Define file paths
ENV_FILE=".env"
ENV_EXAMPLE_FILE=".env.example"

# Check if both files exist
if [[ ! -f "$ENV_FILE" ]]; then
  echo "Error: $ENV_FILE file not found!"
  exit 1
fi

if [[ ! -f "$ENV_EXAMPLE_FILE" ]]; then
  echo "Error: $ENV_EXAMPLE_FILE file not found!"
  exit 1
fi

# Extract keys from both files
ENV_KEYS=$(grep -o '^[^#]*' "$ENV_FILE" | grep '=' | cut -d '=' -f 1 | sort)
ENV_EXAMPLE_KEYS=$(grep -o '^[^#]*' "$ENV_EXAMPLE_FILE" | grep '=' | cut -d '=' -f 1 | sort)

# Compare keys
MISSING_IN_ENV=$(comm -23 <(echo "$ENV_EXAMPLE_KEYS") <(echo "$ENV_KEYS"))
EXTRA_IN_ENV=$(comm -13 <(echo "$ENV_EXAMPLE_KEYS") <(echo "$ENV_KEYS"))

# Output results
if [[ -z "$MISSING_IN_ENV" && -z "$EXTRA_IN_ENV" ]]; then
  echo "Success: Both files are consistent. All keys match."
else
  if [[ -n "$MISSING_IN_ENV" ]]; then
    echo "Keys present in $ENV_EXAMPLE_FILE but missing in $ENV_FILE:"
    while IFS= read -r key; do
      echo "  - $key"
    done <<< "$MISSING_IN_ENV"
  fi

  if [[ -n "$EXTRA_IN_ENV" ]]; then
    echo "Keys present in $ENV_FILE but missing in $ENV_EXAMPLE_FILE:"
    while IFS= read -r key; do
      echo "  - $key"
    done <<< "$EXTRA_IN_ENV"
  fi
  exit 1
fi