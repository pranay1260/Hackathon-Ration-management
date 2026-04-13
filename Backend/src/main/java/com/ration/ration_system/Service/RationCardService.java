package com.ration.ration_system.Service;
import com.ration.ration_system.dto.RationCardRequestDTO;
import com.ration.ration_system.dto.RationCardResponseDTO;
import com.ration.ration_system.entity.RationCard;
import com.ration.ration_system.entity.User;
import com.ration.ration_system.Repository.RationCardRepository;
import com.ration.ration_system.Repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
import java.util.stream.Collectors;
@Service
public class RationCardService {

    private final RationCardRepository rationCardRepository;
    private final UserRepository userRepository;

    public RationCardService(RationCardRepository rationCardRepository,
                             UserRepository userRepository) {
        this.rationCardRepository = rationCardRepository;
        this.userRepository = userRepository;
    }

    public RationCardResponseDTO createRationCard(RationCardRequestDTO dto) {
        System.out.println("Processing Ration Card Request: [Number: " + dto.getCardNumber() + ", UserID: " + dto.getUserId() + "]");

        if (dto.getUserId() == null) {
            System.err.println("FAILED: Missing User ID in request");
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User ID is required");
        }

        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> {
                    System.err.println("FAILED: User ID " + dto.getUserId() + " not found in DB");
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
                });
        boolean hasCard = rationCardRepository.findAll().stream()
                .anyMatch(c -> c.getUser() != null && c.getUser().getId().equals(user.getId()));
        
        if (hasCard) {
            System.err.println("FAILED: User " + user.getId() + " already has a ration card");
            throw new ResponseStatusException(HttpStatus.CONFLICT, "This user already has a ration card.");
        }

        RationCard card = new RationCard();
        card.setCardNumber(dto.getCardNumber());
        card.setFamilySize(dto.getFamilySize());
        
        try {
            card.setCardType(RationCard.CardType.valueOf(dto.getCardType()));
            card.setStatus(RationCard.CardStatus.valueOf(dto.getStatus()));
        } catch (Exception e) {
            card.setCardType(RationCard.CardType.BPL);
            card.setStatus(RationCard.CardStatus.ACTIVE);
        }
        
        card.setIssueDate(dto.getIssueDate());
        card.setExpiryDate(dto.getExpiryDate());
        card.setUser(user);

        RationCard saved = rationCardRepository.save(card);
        System.out.println("SUCCESS: Ration Card created (ID: " + saved.getId() + ")");
        return mapToResponse(saved);
    }

    public List<RationCardResponseDTO> getAllCards() {
        return rationCardRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<RationCardResponseDTO> getCardsByUserId(Long userId) {
        return rationCardRepository.findAll().stream()
                .filter(c -> c.getUser() != null && c.getUser().getId().equals(userId))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public RationCardResponseDTO updateCardStatus(Long cardId, String status) {
        RationCard card = rationCardRepository.findById(cardId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ration Card not found"));

        try {
            card.setStatus(RationCard.CardStatus.valueOf(status));
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid Card Status: " + status);
        }

        RationCard saved = rationCardRepository.save(card);
        System.out.println("STATUS UPDATED: Card " + card.getCardNumber() + " is now " + status);
        return mapToResponse(saved);
    }

    private RationCardResponseDTO mapToResponse(RationCard saved) {
        RationCardResponseDTO response = new RationCardResponseDTO();
        response.setId(saved.getId());
        response.setCardNumber(saved.getCardNumber());
        response.setFamilySize(saved.getFamilySize());
        response.setCardType(saved.getCardType().name());
        response.setStatus(saved.getStatus().name());
        response.setIssueDate(saved.getIssueDate());
        response.setExpiryDate(saved.getExpiryDate());
        if (saved.getUser() != null) response.setUserId(saved.getUser().getId());
        return response;
    }
}