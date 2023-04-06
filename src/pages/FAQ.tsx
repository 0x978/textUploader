import { FC } from "react";
import { useRouter } from "next/router";


const FAQ: FC = ({}) => {
    const router = useRouter();
    return (
        <main className="flex h-screen text-center bg-deepPurple ">
            <div className="m-auto space-y-3 flex flex-col">

                <h1 className="text-white text-lg">Questions you might have I guess</h1>

                <h1 className={"text-contrastingBlue  "}>What is this site for?</h1>
                <text className={"text-superCoolEdgyPurple "}>
                    This site allows you to upload and store/group/view pieces of text called pastes <br />
                    you can upload text using shareX, with the custom `text` config pointed to this site<br />
                    you can also upload text using the relevant feature once authenticated <br />
                    It&apos;s basically an edgier looking pastebin
                </text>

                <h1 className={"text-contrastingBlue"}>What data do you keep?</h1>
                <text className={"text-superCoolEdgyPurple "}>
                    Since all authentication is done via Oauth providers (Discord, Google, Etc) <span
                    className={"text-red-400"}>I do not see, or store any passwords </span>
                    <br />
                    I store your Discord name (excluding unique tag #xxxx) and email address (required for auth)<br />
                    I obviously also store any pastes uploaded
                </text>

                <h1 className={"text-contrastingBlue"}>Are pastes private or secure?</h1>
                <text className={"text-superCoolEdgyPurple "}>
                    Pastes are `unlisted` by default, that is, anyone who doesn&apos;t have the URL cannot view
                    it. <br />
                    I will probably make a feature eventually which allows pastes to be private <br />
                    Pastes are not encrypted, so please do not upload any passwords to sites you use <br />
                    <a className={"cursor-pointer text-green-400 underline"}
                       href={"/rawPasteDisplay/?id=clg3l8m9l0003mc09wwx0hqgn"}>You can view a paste here</a>
                </text>

                <h1 className={"text-contrastingBlue"}>Can I store images if I point shareX to your API?</h1>
                <text className={"text-superCoolEdgyPurple "}>
                    No, I can&apos;t find a way to store images for cheap, if you know how let me know <br />
                    I highly recommend <a href={"https://upload.systems"}
                                          className={"underline text-green-400"}>upload.systems</a> if you want image
                    hosting, they&apos;re pretty cool
                </text>

                <h1 className={"text-contrastingBlue"}>Is the site open source?</h1>
                <text className={"text-superCoolEdgyPurple "}>
                    <a className={"cursor-pointer text-green-400 underline"}
                       href={"https://github.com/0x978/textUploader"}>Yea
                        click here</a>
                </text>

                <h1 className={"text-contrastingBlue"}>The code sucks</h1>
                <text className={"text-superCoolEdgyPurple "}>
                    Not a question but yeah probably.
                </text>


                <div>
                    <button className={"bg-puddlePurple text-green-400 w-32 "}
                            onClick={() => void router.push("/")}>Return
                    </button>
                </div>

            </div>
        </main>
    );
};

export default FAQ;