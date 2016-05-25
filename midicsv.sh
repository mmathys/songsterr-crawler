for file in ./midi/*
do
  filename=$(basename "$file")
  filename="${filename%.*}"
  timeout 10 midicsv "$file" "./csv/$filename.csv"
  echo "$filename"
done
