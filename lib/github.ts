const GITHUB_USERNAME = "CaesarAidarus22";
const GITHUB_REVALIDATE_SECONDS = 3600;

export type GithubContributionDay = {
  date: string;
  contributionCount: number;
  weekday: number;
};

export type GithubContributionWeek = {
  contributionDays: GithubContributionDay[];
};

export type GithubRepository = {
  name: string;
  description: string | null;
  url: string;
  stargazerCount: number;
  primaryLanguage: GithubLanguage | null;
  updatedAt: string;
};

export type GithubLanguage = {
  name: string;
  color: string | null;
  size?: number;
};

export type GithubActivityData = {
  user: {
    login: string;
    avatarUrl: string;
    url: string;
    followers: number;
    following: number;
    publicRepositories: number;
  };
  contributionCalendar: {
    totalContributions: number;
    weeks: GithubContributionWeek[];
  };
  repositories: GithubRepository[];
  languages: GithubLanguage[];
  fetchedAt: string;
};

type GithubGraphQlResponse = {
  data?: {
    user: {
      login: string;
      avatarUrl: string;
      url: string;
      followers: { totalCount: number };
      following: { totalCount: number };
      repositories: {
        totalCount: number;
        nodes: Array<{
          name: string;
          description: string | null;
          url: string;
          stargazerCount: number;
          updatedAt: string;
          primaryLanguage: { name: string; color: string | null } | null;
          languages: {
            edges: Array<{
              size: number;
              node: { name: string; color: string | null };
            }>;
          };
        }>;
      };
      contributionsCollection: {
        contributionCalendar: {
          totalContributions: number;
          weeks: GithubContributionWeek[];
        };
      };
    } | null;
  };
  errors?: Array<{ message: string }>;
};

type GithubRepositoryNode = NonNullable<
  NonNullable<GithubGraphQlResponse["data"]>["user"]
>["repositories"]["nodes"][number];

const query = `
  query GithubActivity($login: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $login) {
      login
      avatarUrl(size: 160)
      url
      followers {
        totalCount
      }
      following {
        totalCount
      }
      repositories(
        first: 24
        privacy: PUBLIC
        ownerAffiliations: OWNER
        isFork: false
        orderBy: { field: UPDATED_AT, direction: DESC }
      ) {
        totalCount
        nodes {
          name
          description
          url
          stargazerCount
          updatedAt
          primaryLanguage {
            name
            color
          }
          languages(first: 8, orderBy: { field: SIZE, direction: DESC }) {
            edges {
              size
              node {
                name
                color
              }
            }
          }
        }
      }
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              weekday
            }
          }
        }
      }
    }
  }
`;

function getContributionWindow() {
  const to = new Date();
  const from = new Date(to);
  from.setUTCFullYear(from.getUTCFullYear() - 1);

  return {
    from: from.toISOString(),
    to: to.toISOString(),
  };
}

function collectLanguages(repositories: GithubRepositoryNode[]) {
  const languageMap = new Map<string, GithubLanguage & { size: number }>();

  repositories.forEach((repository) => {
    repository.languages.edges.forEach((edge) => {
      const current = languageMap.get(edge.node.name);

      languageMap.set(edge.node.name, {
        name: edge.node.name,
        color: edge.node.color,
        size: (current?.size ?? 0) + edge.size,
      });
    });
  });

  return Array.from(languageMap.values())
    .sort((left, right) => (right.size ?? 0) - (left.size ?? 0))
    .slice(0, 8);
}

export async function getGithubActivity(): Promise<GithubActivityData | null> {
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    return null;
  }

  const { from, to } = getContributionWindow();

  try {
    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables: {
          login: GITHUB_USERNAME,
          from,
          to,
        },
      }),
      next: {
        revalidate: GITHUB_REVALIDATE_SECONDS,
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub GraphQL responded with ${response.status}`);
    }

    const payload = (await response.json()) as GithubGraphQlResponse;

    if (payload.errors?.length) {
      throw new Error(payload.errors.map((error) => error.message).join("; "));
    }

    const user = payload.data?.user;

    if (!user) {
      throw new Error("GitHub user was not returned.");
    }

    const repositories = user.repositories.nodes.map((repository) => ({
      name: repository.name,
      description: repository.description,
      url: repository.url,
      stargazerCount: repository.stargazerCount,
      primaryLanguage: repository.primaryLanguage,
      updatedAt: repository.updatedAt,
    }));

    return {
      user: {
        login: user.login,
        avatarUrl: user.avatarUrl,
        url: user.url,
        followers: user.followers.totalCount,
        following: user.following.totalCount,
        publicRepositories: user.repositories.totalCount,
      },
      contributionCalendar: user.contributionsCollection.contributionCalendar,
      repositories,
      languages: collectLanguages(user.repositories.nodes),
      fetchedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.warn("GitHub activity could not be loaded:", error);
    return null;
  }
}
