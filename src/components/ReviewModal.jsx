import {
  Backdrop,
  Button,
  HelperText,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Textarea,
} from "@windmill/react-ui";
import { useUser } from "context/UserContext";
import { useState } from "react";
import toast from "react-hot-toast";
import ReactStars from "react-rating-stars-component";
import { useNavigate } from "react-router-dom";
import reviewService from "services/review.service";

const ReviewModal = ({ product_id, reviews }) => {
  const { userData } = useUser();
  const review = reviews.reviews.find((elm) => elm.user_id === userData?.user_id);
  const { reviewExist } = reviews;

  const [rating, setRating] = useState(1);
  const [content, setContent] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const addReview = async () => {
    try {
      setIsSubmitting(true);
      await reviewService.addReview(product_id, rating, content);
      toast.success("Review added successfully");
      closeModal();
      navigate(0);
    } catch (error) {
      toast.error("Error adding review");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateReview = async () => {
    try {
      setIsSubmitting(true);
      await reviewService.updateReview(review.id, product_id, content, rating);
      toast.success("Review updated successfully");
      closeModal();
      navigate(0);
    } catch (error) {
      toast.error("Error updating review");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    reviewExist ? updateReview() : addReview();
  };

  const closeModal = () => {
    setRating(1);
    setContent("");
    setIsOpen(false);
  };

  const toggleModal = () => {
    setRating(reviewExist ? review.rating : 1);
    setContent(reviewExist ? review.content : "");
    setIsOpen(!isOpen);
  };

  return (
    <>
      {isOpen && <Backdrop />}

      <div>
        <Button
          onClick={toggleModal}
          className="bg-[#7A0BC0] hover:bg-[#5A189A] text-white px-6 py-2 rounded-lg shadow-md transition-all"
        >
          {reviewExist ? "Edit Review" : "Add Review"}
        </Button>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="rounded-xl" aria-label="Review Modal">
        <ModalHeader className="text-[#7A0BC0] text-lg font-bold">
          {reviewExist ? "Edit Your Review" : "Write a Review"}
        </ModalHeader>

        <ModalBody>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Label>
              <span className="font-semibold text-gray-700">Rating</span>
              <div className="mt-2">
                <ReactStars
                  count={5}
                  size={32}
                  value={rating}
                  onChange={setRating}
                  activeColor="#A855F7"
                />
              </div>
            </Label>

            <Label>
              <span className="font-semibold text-gray-700">Your Review</span>
              <Textarea
                className="mt-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                name="content"
                rows="4"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share your experience with this product..."
              />
            </Label>

            <HelperText valid={content.trim().length >= 10}>
              Minimum 10 characters required
            </HelperText>
          </form>
        </ModalBody>

        <ModalFooter>
          <Button
            className="border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg"
            layout="outline"
            onClick={closeModal}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-[#7A0BC0] hover:bg-[#5A189A] text-white rounded-lg"
            disabled={content.trim().length < 10 || rating < 1 || isSubmitting}
          >
            {isSubmitting
              ? "Submitting..."
              : reviewExist
              ? "Save Changes"
              : "Submit Review"}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default ReviewModal;
