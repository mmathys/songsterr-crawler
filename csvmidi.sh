for file in ./filtered/*
do
  filename=$(basename "$file")
  filename="${filename%.*}"
  timeout 10 csvmidi "$file" "./rnn/music/$filename.midi"
  echo "$filename"
done
