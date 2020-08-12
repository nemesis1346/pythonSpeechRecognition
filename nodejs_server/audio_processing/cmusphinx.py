#!/usr/bin/python3
import sys
import speech_recognition as sr
import time
from os import path

# this is the input of the console.
filename = sys.argv[1]
# uuid = sys.argv[2]
# language= sys.argv[2]

def redirect_to_file(text, uuid):
    original = sys.stdout
    sys.stdout = open('../text_files/'+uuid+'.txt', 'w')
    # print(text)
    sys.stdout = original
    # print('This string goes to stdout, NOT the file!')


def transcribe(filename):
    finalTranscription = ""

    try:
        start = time.process_time()
        AUDIO_FILE = path.join(path.dirname(
            path.realpath(__file__)),filename)

        # use the audio file as the audio source
        r = sr.Recognizer()
        with sr.AudioFile(AUDIO_FILE) as source:
            audio = r.record(source)  # read the entire audio file

        # recognize speech using Sphinx in ENGLISH
        finalTranscription = r.recognize_sphinx(audio)
    except Exception as e:
        finalTranscription = ""
        print("ERROR")
        print(e)
    except sr.UnknownValueError:
        print("ERROR")
        print("Sphinx could not understand audio")
    except sr.RequestError as e:
        print("ERROR")
        print("Sphinx error; {0}".format(e))
    

    # print(time.process_time() - start)
    return finalTranscription


def main():
    transcription = transcribe(filename)
    # redirect_to_file(transcription, uuid)
    sys.stdout.write(transcription)


# Start process
if __name__ == '__main__':
    main()
