import React from "react";
import { mount } from "enzyme";

import { ORDERS, PRODUCTS } from "__support__/sample_dataset_fixture";

import { FieldValuesWidget } from "metabase/components/FieldValuesWidget";
import TokenField from "metabase/components/TokenField";

const mock = (object, properties) =>
  Object.assign(Object.create(object), properties);

const mountFieldValuesWidget = props =>
  mount(
    <FieldValuesWidget
      value={[]}
      onChange={() => {}}
      fetchFieldValues={() => {}}
      {...props}
    />,
  );

describe("FieldValuesWidget", () => {
  describe("category field", () => {
    describe("has_field_values = none", () => {
      const props = {
        field: mock(PRODUCTS.CATEGORY, {
          has_field_values: "none",
        }),
      };
      it("should not call fetchFieldValues", () => {
        const fetchFieldValues = jest.fn();
        mountFieldValuesWidget({ ...props, fetchFieldValues });
        expect(fetchFieldValues).not.toHaveBeenCalled();
      });
      it("should have 'Enter some text' as the placeholder text", () => {
        const component = mountFieldValuesWidget({ ...props });
        expect(component.find(TokenField).props().placeholder).toEqual(
          "Enter some text",
        );
      });
    });
    describe("has_field_values = list", () => {
      const props = {
        field: PRODUCTS.CATEGORY,
      };
      it("should call fetchFieldValues", () => {
        const fetchFieldValues = jest.fn();
        mountFieldValuesWidget({ ...props, fetchFieldValues });
        expect(fetchFieldValues).toHaveBeenCalledWith(PRODUCTS.CATEGORY.id);
      });
      it("should have 'Search the list' as the placeholder text", () => {
        const component = mountFieldValuesWidget({ ...props });
        expect(component.find(TokenField).props().placeholder).toEqual(
          "Search the list",
        );
      });
    });
    describe("has_field_values = search", () => {
      const props = {
        field: mock(PRODUCTS.CATEGORY, {
          has_field_values: "search",
        }),
        searchField: PRODUCTS.CATEGORY,
      };
      it("should not call fetchFieldValues", () => {
        const fetchFieldValues = jest.fn();
        mountFieldValuesWidget({ ...props, fetchFieldValues });
        expect(fetchFieldValues).not.toHaveBeenCalled();
      });
      it("should have 'Search by Category' as the placeholder text", () => {
        const component = mountFieldValuesWidget({ ...props });
        expect(component.find(TokenField).props().placeholder).toEqual(
          "Search by Category",
        );
      });
    });
  });
  describe("id field", () => {
    describe("has_field_values = none", () => {
      it("should have 'Enter an ID' as the placeholder text", () => {
        const component = mountFieldValuesWidget({
          field: mock(ORDERS.PRODUCT_ID, {
            has_field_values: "none",
          }),
        });
        expect(component.find(TokenField).props().placeholder).toEqual(
          "Enter an ID",
        );
      });
    });
    describe("has_field_values = list", () => {
      it("should have 'Search the list' as the placeholder text", () => {
        const component = mountFieldValuesWidget({
          field: mock(ORDERS.PRODUCT_ID, {
            has_field_values: "list",
            values: [[1234]],
          }),
        });
        expect(component.find(TokenField).props().placeholder).toEqual(
          "Search the list",
        );
      });
    });
    describe("has_field_values = search", () => {
      it("should have 'Search by Category or enter an ID' as the placeholder text", () => {
        const component = mountFieldValuesWidget({
          field: mock(ORDERS.PRODUCT_ID, {
            has_field_values: "search",
          }),
          searchField: PRODUCTS.CATEGORY,
        });
        expect(component.find(TokenField).props().placeholder).toEqual(
          "Search by Category or enter an ID",
        );
      });
      it("should not duplicate 'ID' in placeholder when ID itself is searchable", () => {
        const field = mock(ORDERS.PRODUCT_ID, {
          base_type: "type/Text",
          has_field_values: "search",
        });
        const component = mountFieldValuesWidget({
          field: field,
          searchField: field,
        });
        expect(component.find(TokenField).props().placeholder).toEqual(
          "Search by Product",
        );
      });
    });
  });
});
