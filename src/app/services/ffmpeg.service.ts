import { Injectable } from '@angular/core';
import { createFFmpeg } from '@ffmpeg/ffmpeg';

@Injectable({
  providedIn: 'root'
})
export class FfmpegService {
  // FFmpeg is ready if it is loaded:
  isReady = false
  // FFmpeg instance:
  private ffmpeg

  constructor() {
    // The factory function createFFmpeg() return an instance of FFmpeg class:
    this.ffmpeg = createFFmpeg({ log: true })
  }

  async init() {
    // Check if FFmpeg is loaded:
    if (this.isReady) {
      return
    }

    // download FFmpeg:
    await this.ffmpeg.load()

    // Signal the FFmpeg is loaded:
    this.isReady = true
  }
}
