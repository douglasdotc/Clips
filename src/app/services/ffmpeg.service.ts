import { Injectable } from '@angular/core';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

@Injectable({
  providedIn: 'root'
})
export class FfmpegService {
  // Indicate that FFmpeg is getting screenshots:
  isRunning = false
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

    // Download FFmpeg:
    await this.ffmpeg.load()

    // Signal the FFmpeg is loaded:
    this.isReady = true
  }

  async getScreenshots(file: File) {
    this.isRunning = true
    // Convert file to binary data:
    const data = await fetchFile(file)

    // Store the file in shared memory, FS: File System,
    // FS() access the package's independent filesystem.
    // FFmpeg searches for files in this memory:
    this.ffmpeg.FS('writeFile', file.name, data)

    // seconds that we what to take a screenshot:
    const seconds = [1,2,3]
    // commands for ffmpeg commandline:
    const commands: string[] = []

    seconds.forEach(second => {
      commands.push(
        // command line:
        // Input, -i option tells FFmpeg to grab a specific file
        // (file.name) from our file system:
        '-i', file.name,

        // Output Options, -ss option allow us to configure the current timestamp to hh:mm:ss,
        // -frames:v allow us to configure how many frames we want to focus on,
        // -filter:v allow us to modify the original source of the image,
        // '-1' in the scale function tells ffmpeg to preserve the aspect ratio.
        '-ss', `00:00:0${second}`,
        '-frames:v', '1',
        '-filter:v', 'scale=510:-1',

        // Output:
        `output_0${second}.png`
      )
    })

    // Run FFmpeg to get screenshot:
    await this.ffmpeg.run(
      ...commands
    )

    const screenshots: string[] = []
    seconds.forEach(second => {
      // Get screenshot as binary:
      const screenshotFile = this.ffmpeg.FS('readFile', `output_0${second}.png`)

      // convert binary data to a Blob:
      // Blob: Binary large object, browser can render blobs, but they are immutable.
      const screenshotBlob = new Blob(
        [screenshotFile.buffer], {
          type: 'image/png'
        }
      )

      // Convert the blob to URL (string):
      const screenshotURL = URL.createObjectURL(screenshotBlob)

      screenshots.push(screenshotURL)
    })
    this.isRunning = false
    return screenshots
  }
}
