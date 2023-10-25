import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  makeStyles,
  Card,
  CardContent,
  Typography,
  createTheme,
  ThemeProvider,
  CardMedia,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    marginBottom: 20,
    backgroundColor: "#1a1a1a",
    color: "#fff",
  },
  title: {
    fontFamily: "Montserrat",
    cursor: "pointer",
    fontSize: "1.2rem",
    lineHeight: 1.2,
    fontWeight: "bold",
    marginLeft: 10,
    marginBottom: 5,
    marginTop: -15,
  },
  cardImage: {
    width: 100,
    height: 100,
    objectFit: "cover",
    margin: 10,
    borderRadius: "10px",
    boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.3)",
  },
  description: {
    fontSize: "0.9rem",
    lineHeight: 1.2,
    marginLeft: 10,
  },
  content: {
    display: "flex",
    alignItems: "top",
  },
}));

const News = ({ coinName }) => {
  const [news, setNews] = useState([]);
  const classes = useStyles();
  const uniqueLinks = new Set();

  useEffect(() => {
    const apiKey = "3b7c86c1e2dc440e9d9bb323b8b280eb";
    const apiUrl = `https://newsapi.org/v2/everything?q=${coinName}%20AND%20cryptocurrency&apiKey=${apiKey}`;

    axios
      .get(apiUrl)
      .then((response) => {
        const allArticles = response.data.articles;

        // Prioritize articles with the coinName in the title
        const filteredNews = allArticles
          .filter((article) => {
            return article.urlToImage && !article.url.includes("biztoc.com");
          })
          .sort((a, b) => {
            if (a.title.includes(coinName) && !b.title.includes(coinName)) {
              return -1;
            }
            if (!a.title.includes(coinName) && b.title.includes(coinName)) {
              return 1;
            }
            return 0;
          });

        const uniqueNews = [];

        for (const article of filteredNews) {
          if (!uniqueLinks.has(article.url)) {
            uniqueLinks.add(article.url);
            uniqueNews.push(article);
          }
        }

        // Slice the first 10 articles
        setNews(uniqueNews.slice(0, 10));
      })
      .catch((error) => {
        console.error("Error fetching news:", error);
      });
  }, [coinName]);

  const darkTheme = createTheme({
    palette: {
      primary: {
        main: "#fff",
      },
      type: "dark",
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <div>
        {news.map((article, index) => (
          <Card key={index} className={classes.root}>
            <CardMedia
              className={classes.cardImage}
              component="img"
              alt={article.title}
              image={article.urlToImage}
              title={article.title}
              onError={(e) => {
                e.target.src = "/placeholder-image.png";
              }}
            />
            <div className={classes.content}>
              <CardContent>
                <div className={classes.textContainer}>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={classes.title}
                  >
                    <Typography variant="h6" className={classes.title}>
                      <span className={classes.whiteText}>
                        {article.title.slice(0, article.title.indexOf(" - "))}
                      </span>
                      {article.title.slice(article.title.indexOf(" - "))}
                    </Typography>
                  </a>
                  <Typography variant="body2" className={classes.description}>
                    {article.description}
                  </Typography>
                </div>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>
    </ThemeProvider>
  );
};

export default News;
