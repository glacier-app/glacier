import Head from "next/head";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Navbar } from "@frontend/components/Nav";
import { UsernamePopup } from "@frontend/components/UsernamePopup";

export default function Friends() {
	const [userFriends, setData] = useState(null);
	const [isLoading, setLoading] = useState(false);
	const { data: session } = useSession();
	const [showUsernameInput, setShowUsernameInput] = useState(false);
	const email = session?.user.email;
	const name = session?.user.name;

	console.log(email);
	const links = [
		{ id: "1", text: "Home", path: "/" },
		{ id: "2", text: "Profile", path: "/profile" },
	];

	useEffect(() => {
		setLoading(true);
		fetch("/api/friends", {
			body: JSON.stringify({ email }),
			method: "POST",
		}).then(async (res) => {
			if (email === undefined) return;
			console.log("hi");
			setData(await res.json());
			setLoading(false);
		});
	}, [session, email, name]);

	useEffect(() => {
		fetch("/api/profileSetup", {
			body: JSON.stringify({ email, add: false }),
			method: "POST",
		}).then(async (res) => {
			var user = await res.json();
			console.log(user);
			if (user.success === false) {
				setShowUsernameInput(true);
			}
		});
	}, [session, showUsernameInput, email]);

	const onChange = (e) => {
		const query = e.target.value;
		console.log(query);
	};

	console.log(!isLoading);
	if (userFriends === null) return;
	console.log(userFriends);
	return (
		<div>
			<Head>
				<title>Friends</title>
				<meta
					name="description"
					content="Generated by create next app"
				/>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main>
				<Navbar links={links} />
				{showUsernameInput && (
					<UsernamePopup activate={showUsernameInput} />
				)}
				<h1 className="text-center text-nord_light-300 font-bold text-xl pt-10">
					{name}&#39;s Friends
				</h1>
				<div className="grid place-items-center pt-5">
					<form>
						<input
							onChange={onChange}
							placeholder="Search"
							className="bg-nord_dark-200 outline-none rounded-lg text-nord_light-300 pt-2 pb-2 pl-4 pr-4"
						></input>
					</form>
					<div className="pt-5 pb-5 pl-10 pr-10 w-screen mt-8">
						<ol id="friends">
							{userFriends.friends !== null &&
								showUsernameInput !== true &&
								userFriends.friends.map((users) => (
									<li
										key={users.name}
										className="text-nord_light-300 pt-3 pb-3"
									>
										{users.name}

										<hr className="border-nord_dark-100 mt-2" />
									</li>
								))}
						</ol>
					</div>
				</div>
			</main>
		</div>
	);
}
