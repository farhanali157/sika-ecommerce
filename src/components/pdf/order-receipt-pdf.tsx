import React from "react"
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer"

const styles = StyleSheet.create({
  page: {
    padding: 36,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#111827",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingBottom: 16,
    marginBottom: 20,
  },
  companyName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#D97706",
  },
  orderTitle: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "right",
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 6,
    textTransform: "uppercase",
    color: "#6B7280",
  },
  gridTwo: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 20,
  },
  col: {
    flex: 1,
  },
  table: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 4,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#F9FAFB",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    padding: 8,
    fontWeight: "bold",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    padding: 8,
  },
  colProduct: { flex: 3 },
  colQty: { flex: 1, textAlign: "center" },
  colPrice: { flex: 1.5, textAlign: "right" },
  colTotal: { flex: 1.5, textAlign: "right" },
  totalsContainer: {
    marginTop: 16,
    alignItems: "flex-end",
  },
  totalsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 200,
    paddingVertical: 3,
  },
  grandTotalRow: {
    borderTopWidth: 1,
    borderTopColor: "#111827",
    paddingTop: 6,
    marginTop: 4,
    fontWeight: "bold",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 36,
    right: 36,
    textAlign: "center",
    fontSize: 8,
    color: "#9CA3AF",
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingTop: 8,
  },
})

export type PDFOrderPayload = {
  id: string
  createdAt: Date | string
  status: string
  customerName?: string | null
  customerEmail?: string | null
  customerPhone?: string | null
  shippingAddress?: string | null
  notes?: string | null
  subtotal?: unknown
  shippingFee?: unknown
  totalAmount: unknown
  items: Array<{
    id: string
    quantity: number
    unitPrice: unknown
    product: {
      name: string
      sku: string
    }
  }>
}

type OrderReceiptProps = {
  order: PDFOrderPayload
}

export function OrderReceiptPDF({ order }: OrderReceiptProps) {
  const subtotal = Number(order.subtotal || 0)
  const shippingFee = Number(order.shippingFee || 0)
  const totalAmount = Number(order.totalAmount || 0)

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.companyName}>SIKA PAKISTAN</Text>
            <Text style={{ fontSize: 8, color: "#6B7280", marginTop: 2 }}>
              Industrial Building Solutions & Chemical Products
            </Text>
          </View>
          <View>
            <Text style={styles.orderTitle}>OFFICIAL RECEIPT</Text>
            <Text style={{ fontSize: 9, color: "#4B5563", marginTop: 2 }}>
              Order #{order.id}
            </Text>
            <Text style={{ fontSize: 8, color: "#9CA3AF" }}>
              Date: {new Date(order.createdAt).toLocaleDateString("en-PK")}
            </Text>
          </View>
        </View>

        {/* Customer & Shipping Details */}
        <View style={[styles.section, styles.gridTwo]}>
          <View style={styles.col}>
            <Text style={styles.sectionTitle}>Customer Details</Text>
            <Text style={{ fontWeight: "bold" }}>{order.customerName || "N/A"}</Text>
            <Text>{order.customerEmail || "N/A"}</Text>
            <Text>{order.customerPhone || "N/A"}</Text>
          </View>
          <View style={styles.col}>
            <Text style={styles.sectionTitle}>Shipping Address</Text>
            <Text>{order.shippingAddress || "N/A"}</Text>
            {order.notes ? (
              <Text style={{ marginTop: 4, fontStyle: "italic", color: "#4B5563" }}>
                Notes: &quot;{order.notes}&quot;
              </Text>
            ) : null}
          </View>
        </View>

        {/* Line Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.colProduct}>Product Description</Text>
            <Text style={styles.colQty}>Qty</Text>
            <Text style={styles.colPrice}>Unit Price</Text>
            <Text style={styles.colTotal}>Total (PKR)</Text>
          </View>

          {order.items.map((item) => {
            const lineTotal = Number(item.unitPrice) * item.quantity
            return (
              <View key={item.id} style={styles.tableRow}>
                <View style={styles.colProduct}>
                  <Text style={{ fontWeight: "bold" }}>{item.product.name}</Text>
                  <Text style={{ fontSize: 8, color: "#6B7280" }}>
                    SKU: {item.product.sku}
                  </Text>
                </View>
                <Text style={styles.colQty}>{item.quantity}</Text>
                <Text style={styles.colPrice}>
                  {Number(item.unitPrice).toLocaleString()}
                </Text>
                <Text style={styles.colTotal}>
                  {lineTotal.toLocaleString()}
                </Text>
              </View>
            )
          })}
        </View>

        {/* Totals Summary */}
        <View style={styles.totalsContainer}>
          <View style={styles.totalsRow}>
            <Text style={{ color: "#6B7280" }}>Subtotal:</Text>
            <Text>PKR {subtotal.toLocaleString()}</Text>
          </View>
          <View style={styles.totalsRow}>
            <Text style={{ color: "#6B7280" }}>Shipping Fee:</Text>
            <Text>
              {shippingFee === 0 ? "FREE" : `PKR ${shippingFee.toLocaleString()}`}
            </Text>
          </View>
          <View style={[styles.totalsRow, styles.grandTotalRow]}>
            <Text style={{ fontSize: 11 }}>Grand Total:</Text>
            <Text style={{ fontSize: 11, color: "#D97706" }}>
              PKR {totalAmount.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          This is an electronically generated receipt for your order with Sika Pakistan.
          For support or inquiries, please contact support@sika.com.pk.
        </Text>
      </Page>
    </Document>
  )
}