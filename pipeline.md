Pipeline
--------
```
 All GP5      -->       GP5         -->          MIDI       -->        CSV       -->       Filter CSV     -->       MIDI     -->   MP3
               |                     |                       |                    |                        |                  |
           extract.js         TabConverter.jar             midicsv             filter.js                csvmidi           python rnn
       gp5 --> selection     selection --> midi         midi --> csv      csv --> filtered      filtered --> rnn/music

```
