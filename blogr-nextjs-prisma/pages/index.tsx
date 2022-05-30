import React, { useState } from "react"
import { GetStaticProps } from "next"
import Layout from "../components/Layout"
import Post, { PostProps } from "../components/Post"
import prisma from '../lib/prisma';


export const getStaticProps: GetStaticProps = async () => {
  const feed = await prisma.post.findMany({
    where: { published: true },
    include: {
      author: {
        select: { name: true },
      },
    },
  });
  return { props: { feed } };
}

const filterFeed = (searchValue, posts, setResults) => {
  let results = [];
  if (searchValue === "") return setResults(posts);
  for (const post of posts) {
    let pattern = new RegExp(searchValue, "i");
    if (0
      // [...searchValue].includes(post.title) ||
      // searchValue === post.title ||
      // searchValue.split(" ").includes(post.title)
      // (pattern.match() || )
    ) {
      results.push(post);
    }
  }
  setResults(results);
}

type Props = {
  feed: PostProps[]
}

const Blog: React.FC<Props> = (props) => {
  const [filterByName, setFilterByName] = useState("");
  const [filterByNameResults, setFilterByNameResults] = useState([]);

  return (
    <Layout>
      <div className="page">
        <h1>Public Feed</h1>
        <input 
          type="text"
          onChange={(e) => setFilterByName(e.target.value)}
          onKeyUp={(e) =>
            filterFeed(
              (e.target as HTMLInputElement).value,
              props.feed,
              setFilterByNameResults
            )
          }></input>
        <main>
          {/* {props.feed.map((post) => (
            <div key={post.id} className="post">
              <Post post={post} />
            </div>
          ))} */}
          {filterByNameResults && filterByNameResults.length
            ? filterByNameResults.map((post) => (
              <div key={post.id} className="post">
                <Post post={post} />
              </div>
              ))
            : ""}
        </main>
        
      </div>
      <style jsx>{`
        .post {
          background: white;
          transition: box-shadow 0.1s ease-in;
        }

        .post:hover {
          box-shadow: 1px 1px 3px #aaa;
        }

        .post + .post {
          margin-top: 2rem;
        }
      `}</style>
    </Layout>
  )
}

export default Blog
