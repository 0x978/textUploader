import { GetServerSidePropsContext } from "next";

export default function fetchIPFromContext(ctx: GetServerSidePropsContext){
    try{
        return ctx.req.headers["x-real-ip"] as string
    }
    catch (e){
        return "IP header not set"
    }
}