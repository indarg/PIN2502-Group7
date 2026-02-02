import React from "react";
import { DiscussionEmbed } from "disqus-react";

type Props = {
  articleId: string;
  articleTitle: string;
  url:string
};

const DisqusComments: React.FC<Props> = ({ articleId,  articleTitle,url }) => {
  const disqusShortname = "motorizando"; // 👈 Cambiar por tu shortname real
  const disqusConfig = {
    url: `https://motorizando.com.ar/${url}${articleId}`,
    identifier: articleId,
    title: articleTitle,
  };

  return (
    <div style={{ marginTop: "2rem" }}>
      <DiscussionEmbed shortname={disqusShortname} config={disqusConfig} />
    </div>
  );
};

export default DisqusComments;
