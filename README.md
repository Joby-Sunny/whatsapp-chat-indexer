## Whatsapp Chat Indexing to Elasticsearch

Application can be used to parse a **Whatsapp Chat Export File [txt file]** and index it into elasticsearch.

The file is processed into a json file using awk and these json files are then processed by node application to index into elasticsearch

Chat is indexed into different indices based on Year and Month

Application is still work in progress. 

    * Convertion and clean-up of `.txt` file to `.json` still needs to be worked on to hadle completex messages like html code. some weired emoji with backslash infront of it.

    * Node application needs a solid logging service to log operations.

    * Error hanling in Node application needs to be imporved [ currently halts on any error ].
