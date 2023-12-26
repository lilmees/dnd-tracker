export function readFile (file: File, cb: (e: ProgressEvent<EventTarget>) => void): void {
  const reader = new FileReader()

  reader.onload = (e: ProgressEvent) => {
    cb(e)
  }

  reader.readAsDataURL(file)
}
