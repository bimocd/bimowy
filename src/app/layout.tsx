import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import type { PropsWithChildren } from "react";
import SideBarWrapper from "@/app/(main)/cpn/SidebarWrapper";

import "./style.css";

const outfitFont = Outfit({
	subsets: ["latin"],
	variable: "--font-outfit",
});

export const metadata: Metadata = {
	description:
		"Free & Open source platform where you can choose any math subject and train on it repeatedly with automatically-generated exercises. You can set the options for the difficulty, number of questions, numbers range etc..",
	title: "Bimowy",
};

export default function RootLayout({ children }: PropsWithChildren) {
	return (
		<html lang="en">
			<body className={`${outfitFont.className} dark`}>
				{process.env.NODE_ENV === "production" && (
					<>
						<Analytics />
						<SpeedInsights />
					</>
				)}
				<SideBarWrapper>{children}</SideBarWrapper>
			</body>
		</html>
	);
}
