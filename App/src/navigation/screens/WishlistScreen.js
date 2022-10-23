import VideoCardsList from "../../components/VideoCardsList";

export default function WishlistScreen({ navigation }) {
  return (
    <VideoCardsList buttons= "upvote-describe" navigation={navigation}></VideoCardsList>
  );
}