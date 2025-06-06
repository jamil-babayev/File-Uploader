# TCP File Transfer System

## Overview
A Node.js implementation of a TCP-based file transfer system with real-time progress tracking. The project is a CLI tool and consists of:
- **Server**: Receives and stores files in `./storage`
- **Client**: Sends files with progress display

## 🚀 Features
- TCP-based file transfer
- Real-time progress percentage
- Backpressure handling
- Filename encapsulation
- Comprehensive error handling
- Stream processing for large files

## Prerequisites
- Node.js v16+
- Basic CLI knowledge
- `storage` directory

## 📦 Installation

```bash
  git clone git@github.com:jamil-babayev/File-Uploader.git
  cd File-Uploader
  mkdir storage
```

## Usage

```bash
  node server.js &
  node client.js <filename>
```

## Example Output:

```
  uploading... 0%
  uploading... 25%
  uploading... 50%
  uploading... 75%
  uploading... 100%
  file uploaded successfully.
```
