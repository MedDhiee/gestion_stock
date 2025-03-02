package com.dhia.gestiondestock.model;

import lombok.*;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import java.math.BigDecimal;

import javax.persistence.*;


@Data
@Builder
@NoArgsConstructor
@EqualsAndHashCode(callSuper = false)
@AllArgsConstructor
@Entity
@Table(name="article")
public class Article extends AbstractEntity {
    @Column(name = "codearticle")
    private String codeArticle;
    @Column(name = "In_stock")
    private BigDecimal In_stock;
    @ManyToOne
    @JoinColumn(name="idcategory")
    private Category category;
    @Column(name = "PrixVente")
    private BigDecimal PrixVente;
    @Column(name = "PrixAchat")
    private BigDecimal PrixAchat;
    @Column(name = "designation")
    private String designation;
    @Column(name = "photo")
    private String photo;
}
