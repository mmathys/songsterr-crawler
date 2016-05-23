Pipeline
--------
``
 All GP5    -->     GP5     -->             MIDI     -->       CSV     -->      Filter CSV     -->       MIDI    -->   RNN
             |               |                |                 |                       |                 |
        convert.js    TabConverter.jar      midicsv          filter.js               csvmidi          python rnn
       gp5 --> midi  selection --> midi  midi --> csv    csv --> filtered    filtered --> rnn/music

``
