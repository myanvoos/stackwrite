import { FC } from "react";
import AddNovelistButton from "@/components/AddNovelistButton";

const page: FC = () => {
    return <main className="pt-8">
        <h1 className="font-bold text-5xl mb-8">Add a novelist</h1>
        <AddNovelistButton></AddNovelistButton>
    </main>
}

export default page