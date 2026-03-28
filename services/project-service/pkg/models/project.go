package models

import "time"

type Project struct {
	ID        string    `json:"id" bson:"_id,omitempty"`
	Wallet    string    `json:"wallet" bson:"wallet"`
	Name      string    `json:"name" bson:"name"`
	Scripts   []string  `json:"scripts" bson:"scripts"`
	UpdatedAt time.Time `json:"updatedAt" bson:"updatedAt"`
}