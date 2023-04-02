import { FC, useState } from "react";
import { api } from "~/utils/api";
import { paste } from ".prisma/client";
import { GetServerSidePropsContext } from "next";

interface textEditProps {
  id: string,
}

const TextEdit: FC<textEditProps> = ({ id }) => {
  const [text, setText] = useState<string>("");
  const { mutate: updateText } = api.text.updateText.useMutation();

  const { data: textData, isLoading } = api.text.getTextByID.useQuery<paste>({
    textID: id
  }, {
    onSuccess: () => {
      if (textData?.text) {
        setText(textData.text);
      }
    }
  });

  const submitChanges = () => {
    updateText({
      text: text,
      id: id
    });
  };


  return (
    <main className={`flex h-screen text-center, bg-deepPurple text-superCoolEdgyPurple `}>

      {isLoading ? <h1>Loading...</h1> :

        <div className="mx-auto p-10 w-full ">

          <div className="text-center text-3xl my-3">
            <h1>Paste Edit:</h1>
          </div>

          <textarea className="w-full resize bg-puddlePurple min-h-[5rem] h-96" defaultValue={text}
                    onChange={(e) => setText(e.target.value)}></textarea>

          <div className="text-center my-5">
            <button
              onClick={() => submitChanges()}
              className={`bg-puddlePurple w-40 h-11 rounded-3xl hover:text-green-300 active:translate-y-1.5`}>Submit
              Changes
            </button>
          </div>

        </div>

      }


    </main>
  );
};



export default TextEdit;