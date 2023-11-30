import type { FC } from "react";
import { useRouter } from "next/router";
import ReusableButton from "~/components/reusableButton";


const FAQ: FC = ({}) => {
    const router = useRouter();
    return (
        <main className="flex text-center bg-deepPurple md:h-screen">
            <div className="m-auto space-y-3 flex flex-col p-3 bg-deepPurple">

                <h1 className="text-white text-lg">Questions you might have I guess</h1>

                <h1 className={"text-contrastingBlue"}>What is this site for?</h1>
                <p className={"text-superCoolEdgyPurple "}>
                    This site allows you to upload and store/group/view pieces of text called pastes <br />
                    you can upload text using shareX, with the custom `text` config pointed to this site<br />
                    you can also upload text using the relevant feature once authenticated <br />
                    It&apos;s basically an edgier looking pastebin
                    <br /> <br />
                    Pastes also have markdown support <a className={"cursor-pointer text-green-400 underline"} href={"/markdown"}>an example of which you can see here</a>
                </p>

                <h1 className={"text-contrastingBlue"}>What data do you keep?</h1>
                <p className={"text-superCoolEdgyPurple "}>
                    Since all authentication is done via Oauth providers (Discord, Google, Etc) <span
                    className={"text-red-400"}>I do not see, or store any passwords </span>
                    <br />
                    I store your Discord name (excluding unique tag #xxxx) and email address (required for auth)<br />
                    I obviously also store any pastes uploaded
                </p>

                <h1 className={"text-contrastingBlue"}>Are pastes private or secure?</h1>
                <p className={"text-superCoolEdgyPurple "}>
                    Pastes are `unlisted` by default, that is, anyone who doesn&apos;t have the URL cannot view
                    it. <br />
                    However, you can also set pastes to be private, and only viewable by your account. <br />
                    Pastes are not encrypted, so please do not upload any passwords to sites you use <br />
                    <a className={"cursor-pointer text-green-400 underline"}
                       href={"clgqyloxl000508mh0818de8q"}>You can view a paste here</a>
                </p>

                <h1 className={"text-contrastingBlue"}>Can I store images if I point shareX to your API?</h1>
                <p className={"text-superCoolEdgyPurple "}>
                    Not at the moment, but I am looking into creating an image hoster. <br/>
                    If you have any good advice, please message me on discord @qhn
                </p>

                <h1 className={"text-contrastingBlue"}>Is the site open source?</h1>
                <p className={"text-superCoolEdgyPurple "}>
                    <a className={"cursor-pointer text-green-400 underline"}
                       href={"https://github.com/0x978/textUploader"}>Yea
                        click here</a>
                </p>

                <div>
                    <ReusableButton text={"Return"} onClick={() => void router.push("/")} isDangerous={true}/>
                </div>

            </div>
        </main>
    );
};

export default FAQ;