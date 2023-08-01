export default function Header() {
	return (
		<header className='flex items-center justify-between gap-4 p-4'>
			<a href='/'>
				<h1 className='text-lg font-extrabold'>
					brndias
					<span className='text-cyan-500'>Transcriber</span>
				</h1>
			</a>
			<a
				href='/'
				className='flex items-center text-sm gap-2 specialBtn px-4 py-2 rounded-lg text-blue-400'
			>
				<p>New</p>
				<i className='fa-solid fa-plus'></i>
			</a>
		</header>
	);
}
