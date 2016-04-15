for file in ./gp5/*
do
  filename=$(basename "$file")
  filename="${filename%.*}"
  timeout 10 java -jar converter/TabConverter.jar "$file" midi "./midi/$filename.midi" > /dev/null 2>&1
  echo "$filename"
done
