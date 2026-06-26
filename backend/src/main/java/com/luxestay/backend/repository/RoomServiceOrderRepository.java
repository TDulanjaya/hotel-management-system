package com.luxestay.backend.repository;

import com.luxestay.backend.model.RoomServiceOrder;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoomServiceOrderRepository extends MongoRepository<RoomServiceOrder, String> {
}
