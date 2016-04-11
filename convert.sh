for file in ./gp5/*
do
  filename=$(basename "$file")
  filename="${filename%.*}"
  java -jar converter/TabConverter.jar "$file" midi "./midi/$filename.midi"
done
