package com.ration.ration_system.Service;

import com.ration.ration_system.dto.RationCardRequestDTO;
import com.ration.ration_system.dto.RationCardResponseDTO;
import com.ration.ration_system.entity.RationCard;
import com.ration.ration_system.entity.User;
import com.ration.ration_system.Repository.RationCardRepository;
import com.ration.ration_system.Repository.UserRepository;
import org.springframework.stereotype.Service;

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

        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        RationCard card = new RationCard();
        card.setCardNumber(dto.getCardNumber());
        card.setFamilySize(dto.getFamilySize());
        card.setCardType(RationCard.CardType.valueOf(dto.getCardType()));
        card.setStatus(RationCard.CardStatus.valueOf(dto.getStatus()));
        card.setIssueDate(dto.getIssueDate());
        card.setExpiryDate(dto.getExpiryDate());
        card.setUser(user);

        RationCard saved = rationCardRepository.save(card);

        RationCardResponseDTO response = new RationCardResponseDTO();
        response.setId(saved.getId());
        response.setCardNumber(saved.getCardNumber());
        response.setFamilySize(saved.getFamilySize());
        response.setCardType(saved.getCardType().name());
        response.setStatus(saved.getStatus().name());
        response.setIssueDate(saved.getIssueDate());
        response.setExpiryDate(saved.getExpiryDate());
        response.setUserId(saved.getUser().getId());

        return response;
    }
}