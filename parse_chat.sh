#!/bin/bash

original_files_folder='original';
formatted_files_folder='formatted';
processed_files_folder='processed';
processed_file_extension='.json';
original_file_extension='.txt';

for file in "$@"; do
  formatted_file=$(echo $file | sed 's/'"$original_files_folder"'/'"$formatted_files_folder"'/');
  json_file=$(echo $file | sed 's/'"$original_files_folder"'/'"$processed_files_folder"'/');
  json_file=$(echo $json_file | sed 's/'"$original_file_extension"'/'"$processed_file_extension"'/');
  
  # Base file will have message lines that span multiple lines;These are not easily processed. So the original file is formatted to make is easily processable
  awk '
  BEGIN{
  }
  
  {
    if($1 ~ /^[0-9]+\/[0-9]+\/[0-9]+\,/) {
      printf("%s\n",current_line);
      current_line=$0;
    } else {
      current_line=current_line" "$0;
    }
  }

  END{
    printf("%s\n",current_line);
  }
	' "$file" >>"$formatted_file"
  
  # Each line of a formatted file corresponds to a chat message. Each line in the fromatted file is processed into a json object and stored for easy indexing into elasticsearch

  awk '
  BEGIN{
    printf("[");
  }

  {
    if(date[1] && date[2] && date[3] && time[1] && time[2] && chat[1] && chat[2]) {
      printf("\n{\"month\":\"%s\",\"day\":\"%s\",\"year\":\"%s\",\"hour\":\"%s\",\"minute\":\"%s\",\"name\":\"%s\",\"message\":\"%s\"},", date[1], date[2], date[3],time[1], time[2], chat[1], chat[2]);
    }
  }
    
  NF>1 {
    split(substr($1,1,length($1)-1),date,"/");
    split($2,time,":");
    if($3 == "PM") 
        time[1]=time[1]+12;
    $1=$2=$3=$4="";
    split($0,chat,":");
    gsub(/\"/,"",chat[2])
  }

  END{
    printf("\n{\"month\":\"%s\",\"day\":\"%s\",\"year\":\"%s\",\"hour\":\"%s\",\"minute\":\"%s\",\"name\":\"%s\",\"message\":\"%s\"}\n]", date[1], date[2], date[3],time[1], time[2], chat[1], chat[2]);
  }
  ' "$formatted_file" >>"$json_file"
done
