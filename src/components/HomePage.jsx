import { useState, useEffect, useRef } from "react";

export default function HomePage(props) {
	const { setFile, setAudioStream } = props;

	const [recordingStatus, setRecordingStatus] = useState("inactive");
	const [audioChunks, setAudioChunks] = useState([]);
	const [duration, setDuration] = useState(0);

	const mediaRecorder = useRef(null);

	const mimeType = "audio/webm";

	async function startRecording() {
		let tempStream;

		console.log("Start Recording");

		try {
			const streamData = await navigator.mediaDevices.getUserMedia({
				audio: true,
				video: false,
			});
			tempStream = streamData;
		} catch (err) {
			console.log(err);
			return;
		}
		setRecordingStatus("recording");
		// create new Media Recorder instance using the stream
		const media = new MediaRecorder(tempStream, {
			type: mimeType,
		});
		mediaRecorder.current = media;

		mediaRecorder.current.start();
		let localAudioChunks = [];
		mediaRecorder.current.ondataavailable = (event) => {
			if (typeof event.data === "undefined") {
				return;
			}
			if (event.data.size === 0) {
				return;
			}
			localAudioChunks.push(event.data);
		};
		setAudioChunks(localAudioChunks);
	}

	async function stopRecording() {
		setRecordingStatus("inactive");
		console.log("Stop Recording");

		mediaRecorder.current.stop();
		mediaRecorder.current.onstop = () => {
			const audioBlob = new Blob(audioChunks, { type: mimeType });
			setAudioStream(audioBlob);
			setAudioChunks([]);
			setDuration(0);
		};
	}

	useEffect(() => {
		if (recordingStatus === "inactive") {
			return;
		}
		const interval = setInterval(() => {
			setDuration((curr) => curr + 1);
		}, 1000);
		return () => clearInterval(interval);
	});

	return (
		<main className='flex-1 p-4 flex flex-col justify-center text-center gap-3 sm:gap-4 pb-20'>
			<h1 className='font-semibold text-5xl sm:text-6xl md:text-7xl'>
				brndias <span className='text-cyan-500 bold'>Transcriber</span>
			</h1>
			<h3 className='text-lg font-bold'>
				Record <span className='text-blue-400'> &rarr; </span>
				Transcribe <span className='text-blue-400'> &rarr; </span> Translate
			</h3>
			<button
				onClick={
					recordingStatus === "recording" ? stopRecording : startRecording
				}
				className='flex specialBtn px-4 py-2 rounded-xl items-center text-base justify-between gap-4 mx-auto w-72 max-w-full my-4'
			>
				<p className='text-blue-400'>
					{recordingStatus === "inactive" ? "Record" : `Stop recording`}
				</p>
				<div className='flex-1 flex justify-end'>
					{duration ? <p className='flex self-end'>{duration}s</p> : ""}
				</div>
				<i
					className={
						"fa-solid duration-200 fa-microphone " +
						(recordingStatus === "recording" ? "text-rose-300" : "")
					}
				/>
			</button>
			<p className='text-base'>
				Or{" "}
				<label className='text-blue-400 cursor-pointer hover:text-blue-600 duration-200'>
					Upload{" "}
					<input
						className='hidden'
						type='file'
						accept='.mp3,.wave, .ogg'
						onChange={(e) => {
							const tempFile = e.target.files[0];
							setFile(tempFile);
						}}
					/>
				</label>{" "}
				a mp3 file
			</p>
			<p className='italic text-slate-400'>Free now free forever</p>
		</main>
	);
}
