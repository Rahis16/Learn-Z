export class VoiceRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private recording = false;

  /** Start recording audio */
  public async startRecording() {
    if (this.recording) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.audioChunks = [];
      this.mediaRecorder = new MediaRecorder(stream);

      this.mediaRecorder.ondataavailable = (event: BlobEvent) => {
        this.audioChunks.push(event.data);
      };

      this.mediaRecorder.start();
      this.recording = true;
    } catch (err) {
      console.error("Mic access denied or error:", err);
      throw err;
    }
  }

  /** Stop recording and return audio blob */
  public async stopRecording(): Promise<Blob | null> {
    if (!this.mediaRecorder || !this.recording) return null;

    return new Promise((resolve) => {
      this.mediaRecorder!.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: "audio/webm" });
        this.recording = false;
        resolve(audioBlob);
      };
      this.mediaRecorder!.stop();
    });
  }

  /** Check if currently recording */
  public isRecording() {
    return this.recording;
  }
}
