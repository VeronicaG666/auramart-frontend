import { Card, CardBody } from "@windmill/react-ui";
import { format, parseISO } from "date-fns";
import ReactStars from "react-rating-stars-component";
import { Star } from "react-feather";

const ReviewCard = ({ reviews }) => {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500">
        <Star size={28} className="mx-auto text-purple-400 mb-2" />
        <p className="text-lg font-medium">No reviews yet</p>
        <p className="text-sm text-gray-400">Be the first to leave one!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-6 justify-center">
      {reviews.map((review) => (
        <Card
          key={review.id}
          className="w-full sm:w-64 bg-white border border-purple-100 rounded-xl shadow-md hover:shadow-2xl transform hover:scale-105 transition duration-300 ease-in-out"
        >
          <CardBody>
            {/* Star Rating */}
            <div aria-label={`Rating: ${review.rating} out of 5`}>
              <ReactStars
                count={5}
                size={20}
                edit={false}
                value={review.rating}
                activeColor="#A855F7"
              />
            </div>

            {/* Review Content */}
            <p className="text-gray-700 text-sm leading-snug my-3 italic line-clamp-3">
              "{review.content}"
            </p>

            {/* Reviewer Info */}
            <p className="text-xs text-gray-500 mt-4 font-medium">
              {format(parseISO(review.date), "dd MMM yyyy")} •{" "}
              <span className="text-purple-600">{review.name}</span>
            </p>
          </CardBody>
        </Card>
      ))}
    </div>
  );
};

export default ReviewCard;
