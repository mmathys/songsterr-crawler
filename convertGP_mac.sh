for file in ./gp5/*
do
  filename=$(basename "$file")
  filename="${filename%.*}"
  gtimeout 10 java -jar converter/TabConverter.jar "$file" midi "./midi/$filename.midi"
  echo "$filename"
done
