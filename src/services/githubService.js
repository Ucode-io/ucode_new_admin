import httpsRequest from "@/utils/httpsRequest";
import {useMutation, useQuery} from "react-query";
import axios from "axios";


const githubService = {
  login: (data) => httpsRequest.post('/v2/github/login', data),
  getUser: ({token}) => axios.get('https://api.github.com/user', { headers: { 'Authorization': `Bearer ${token}` } }),
  getRepos: ({ username, token }) => axios.get(`https://api.github.com/user/repos`, { headers: { 'Authorization': `Bearer ${token}` }, params: { visibility: "all" } }),
  getBranches: ({ username, repo, token }) => axios.get(`https://api.github.com/repos/${username}/${repo}/branches`, { headers: { 'Authorization': `Bearer ${token}` } }),
}

export const useGithubLoginMutation = (mutationSettings) => {
  return useMutation((data) => githubService.login(data), mutationSettings);
};

export const useGithubUserQuery = ({ token, queryParams } = {}) => {
  return useQuery(
    ["GITHUB_USER", { token }],
    () => {
      return githubService.getUser({ token });
    },
    queryParams
  );
};

export const useGithubRepositoriesQuery = ({ username, token, queryParams } = {}) => {
  return useQuery(
    ["GITHUB_REPOSITORIES", { username, token }],
    () => {
      return githubService.getRepos({ username, token });
    },
    queryParams
  );
};

export const useGithubBranchesQuery = ({ username, repo, token, queryParams } = {}) => {
  return useQuery(
    ["GITHUB_BRANCHES", { username, repo, token }],
    () => {
      return githubService.getBranches({ username, repo, token });
    },
    queryParams
  );
};

export default githubService;