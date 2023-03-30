import {type NextPage} from "next";
import Head from "next/head";
import {MouseEvent, useState} from "react";
import {useRouter} from "next/router";

const Home: NextPage = () => {
    const [pwd, setPwd] = useState<string>("")
    const router = useRouter()
    const redirect = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        void router.push({
            pathname:"groupSelect",
            query:{
                pwd:pwd
            }
        },"groupSelect")

    }

    return (
        <>
            <Head>
                <title>What?</title>
                <meta name="description" content="Generated by create-t3-app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="STOP READING THE SOURCE. THERE IS NOTHING TO SEE HERE."/>

            <main className="flex items-center justify-center min-h-screen bg-deepPurple text-superCoolEdgyPurple ">

                <div className="flex h-screen text-center">
                    <div className="m-auto">
                    <h1 className="font-bold text-3xl my-5 ">?</h1>
                        <form>
                            <label className="mx-1">Yeah?:</label>
                            <input type="password" onChange={(e) => setPwd(e.target.value)} className="bg-puddlePurple" name="pwd" />
                            <div><button className="my-5 w-20 bg-shallowPurple" onClick={(e) => redirect(e)} >Ok</button></div>
                        </form>

                    </div>
                </div>
            </main>
        </>
    )

};

export default Home;
