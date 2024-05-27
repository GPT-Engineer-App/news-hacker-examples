import { useEffect, useState } from "react";
import { Container, VStack, Box, Text, Link, Spinner, Heading, Flex } from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";

const Index = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json");
        const storyIds = await response.json();
        const top10Ids = storyIds.slice(0, 10);

        const articlePromises = top10Ids.map(async (id) => {
          const articleResponse = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
          return await articleResponse.json();
        });

        const articles = await Promise.all(articlePromises);
        setArticles(articles);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching articles:", error);
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  return (
    <Container maxW="container.lg" p={4}>
      <Flex as="nav" bg="gray.800" color="white" p={4} mb={8} justifyContent="center">
        <Heading as="h1" size="lg">Hacker News</Heading>
      </Flex>
      {loading ? (
        <Flex justifyContent="center" alignItems="center" height="50vh">
          <Spinner size="xl" />
        </Flex>
      ) : (
        <VStack spacing={4} align="stretch">
          {articles.map((article) => (
            <Box key={article.id} p={4} borderWidth="1px" borderRadius="md" boxShadow="md">
              <Link href={article.url} isExternal>
                <Heading as="h2" size="md" mb={2}>
                  {article.title} <ExternalLinkIcon mx="2px" />
                </Heading>
              </Link>
              <Text>By: {article.by}</Text>
              <Text>Score: {article.score}</Text>
            </Box>
          ))}
        </VStack>
      )}
    </Container>
  );
};

export default Index;